import Logger from '../utils/Logger.js';

/**
 * Service for normalizing Storyblok stories into Algolia search records
 * Follows Single Responsibility Principle and Open/Closed Principle
 */
class RecordNormalizer {
  constructor() {
    this.logger = Logger.create('RecordNormalizer');
    this.componentHandlers = new Map([
      ['cafe', this.normalizeCafeComponent.bind(this)],
      ['event', this.normalizeEventComponent.bind(this)]
    ]);
  }

  /**
   * Normalize a single story into an Algolia record
   * @param {Object} story - Storyblok story object
   * @returns {Object|null} Normalized record or null if not processable
   */
  normalizeStory(story) {
    try {
      const contentComponent = this.extractMainContentComponent(story);
      if (!contentComponent) {
        return null;
      }

      const handler = this.componentHandlers.get(contentComponent.component);
      if (!handler) {
        this.logger.warn(`No handler for component type: ${contentComponent.component}`);
        return null;
      }

      return handler(story, contentComponent);

    } catch (error) {
      this.logger.error(`Failed to normalize story ${story.id}`, error);
      return null;
    }
  }

  /**
   * Normalize multiple stories
   * @param {Array} stories - Array of Storyblok stories
   * @returns {Array} Array of normalized records
   */
  normalizeStories(stories) {
    this.logger.info(`Normalizing ${stories.length} stories`);

    const records = [];
    const stats = { processed: 0, skipped: 0, errors: 0 };

    stories.forEach(story => {
      try {
        const record = this.normalizeStory(story);
        if (record) {
          records.push(record);
          stats.processed++;
        } else {
          stats.skipped++;
        }
      } catch (error) {
        stats.errors++;
        this.logger.error(`Error processing story ${story.id}`, error);
      }
    });

    this.logger.info('Normalization complete', stats);
    return records;
  }

  /**
   * Extract the main content component from story body
   * @param {Object} story - Storyblok story object
   * @returns {Object|null} Main content component
   */
  extractMainContentComponent(story) {
    if (!story?.content?.body || !Array.isArray(story.content.body)) {
      return null;
    }

    return story.content.body.find(block =>
      this.componentHandlers.has(block.component)
    );
  }

  /**
   * Create base record structure common to all component types
   * @param {Object} story - Storyblok story object
   * @param {Object} component - Content component
   * @returns {Object} Base record structure
   */
  createBaseRecord(story, component) {
    return {
      objectID: `story_${story.id}`,
      storyId: story.id,
      slug: story.slug,
      type: component.component,
      published_at: story.published_at,
      created_at: story.created_at
    };
  }

  /**
   * Normalize cafe component into Algolia record
   * @param {Object} story - Storyblok story object
   * @param {Object} component - Cafe component
   * @returns {Object} Normalized cafe record
   */
  normalizeCafeComponent(story, component) {
    const record = this.createBaseRecord(story, component);

    // Basic Info
    record.title = component.title || component.name || '';
    record.name = component.name || component.title || '';
    record.short_summary = component.short_summary || '';

    // Extract description and create summary for search compatibility
    const fullDescription = this.extractRichtextContent(component.description);
    record.description = fullDescription;
    record.summary = component.short_summary || this.createSummary(fullDescription);

    // Location & Hours
    record.address = component.address || '';
    record.city = component.city || '';
    record.location = component.location || `${component.city || ''}, ${component.address || ''}`.trim().replace(/^,\s*/, '');

    // Handle geo_location for Algolia geo search
    if (component.geo_location) {
      const [lat, lng] = component.geo_location.split(',').map(coord => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        record._geoloc = { lat, lng };
        record.geo_location = component.geo_location;
      }
    }

    record.opening_hours = this.extractRichtextContent(component.opening_hours);

    // Amenities & Features
    record.wifi = component.wifi === true;
    record.power_outlets = component.power_outlets === true;
    record.noise_level = component.noise_level || '';
    record.seating_capacity = component.seating_capacity || '';
    record.outdoor_seating = component.outdoor_seating === true;
    record.pet_friendly = component.pet_friendly === true;

    // Media
    if (component.hero_image?.filename) {
      record.hero_image = component.hero_image.filename;
    }
    if (component.image?.filename) {
      record.image = component.image.filename;
    }
    if (component.gallery && Array.isArray(component.gallery)) {
      record.gallery = component.gallery.map(img => img.filename).filter(Boolean);
    }

    // Tags & Categories
    record.tags = component.tags ? component.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    record.price_range = component.price_range || '';
    record.specialties = component.specialties || '';

    this.addMetadata(record, component.metadata);

    return record;
  }

  /**
   * Normalize event component into Algolia record
   * @param {Object} story - Storyblok story object
   * @param {Object} component - Event component
   * @returns {Object} Normalized event record
   */
  normalizeEventComponent(story, component) {
    const record = this.createBaseRecord(story, component);

    record.title = component.title;
    record.location = component.location || '';

    // Extract description and create summary for search compatibility
    const fullDescription = this.extractRichtextContent(component.description);
    record.description = fullDescription;
    record.summary = this.createSummary(fullDescription); // For search component compatibility
    record.date = component.date;

    if (component.image?.filename) {
      record.image = component.image.filename;
    }

    this.addMetadata(record, component.metadata);

    return record;
  }

  /**
   * Extract plain text content from Storyblok richtext format
   * @param {Object} richtext - Storyblok richtext object
   * @returns {string} Plain text content
   */
  extractRichtextContent(richtext) {
    if (!richtext?.content) {
      return '';
    }

    let text = '';

    const extractFromNode = (node) => {
      if (node.type === 'text') {
        text += node.text;
      } else if (node.content && Array.isArray(node.content)) {
        node.content.forEach(extractFromNode);
      }
    };

    richtext.content.forEach(extractFromNode);
    return text.trim();
  }

  /**
   * Create a summary from full description (truncated for search results)
   * @param {string} description - Full description text
   * @param {number} maxLength - Maximum length for summary
   * @returns {string} Truncated summary
   */
  createSummary(description, maxLength = 150) {
    if (!description) return '';

    if (description.length <= maxLength) {
      return description;
    }

    // Find the last complete sentence within the limit
    const truncated = description.substring(0, maxLength);
    const lastSentence = truncated.lastIndexOf('.');

    if (lastSentence > maxLength * 0.7) {
      return truncated.substring(0, lastSentence + 1);
    }

    // If no good sentence break, truncate at word boundary
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
  }

  /**
   * Add metadata fields to record
   * @param {Object} record - Record to add metadata to
   * @param {Array} metadata - Metadata array from component
   */
  addMetadata(record, metadata) {
    if (!metadata || !Array.isArray(metadata) || metadata.length === 0) {
      // Set defaults for missing metadata
      record.rating = null;
      record.ai_summary = '';
      record.ai_tags = '';
      record.detected_language = 'en';
      record.open_now = false;
      return;
    }

    const meta = metadata[0];

    // If tags aren't already set from component level, set them from metadata
    if (!record.tags || record.tags.length === 0) {
      const tags = meta.tags ? meta.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      record.tags = tags;
    }

    // For backward compatibility
    record.metadata = record.tags; // For search component compatibility

    // If opening_hours aren't already set from component level, set them from metadata
    if (!record.opening_hours) {
      record.opening_hours = this.extractRichtextContent(meta.opening_hours) || '';
    }

    record.rating = typeof meta.rating === 'number' ? meta.rating : null;

    // AI / Enrichment Fields
    record.ai_summary = meta.ai_summary || '';
    record.ai_tags = meta.ai_tags || '';
    record.detected_language = meta.detected_language || 'en';
    record.open_now = meta.open_now === true;

    // If specialties aren't already set from component level, set them from metadata
    if (!record.specialties) {
      record.specialties = meta.specialties || '';
    }
  }
}

export default RecordNormalizer;