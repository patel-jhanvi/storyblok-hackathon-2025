import Logger from '../utils/Logger.js';

/**
 * Service for interacting with Storyblok API
 * Follows Single Responsibility Principle and Dependency Inversion
 */
class StoryblokService {
  constructor(config) {
    this.config = config;
    this.logger = Logger.create('StoryblokService');
  }

  /**
   * Fetch all stories from Storyblok API
   * @returns {Promise<Array>} Array of stories
   */
  async fetchAllStories() {
    try {
      this.logger.info('Fetching stories from Storyblok API');

      // Try published first, then draft as fallback
      let url = `${this.config.baseUrl}/stories?token=${this.config.token}&version=published&per_page=${this.config.perPage}`;
      let response = await fetch(url);

      if (!response.ok) {
        this.logger.info('Published stories not found, trying draft version');
        url = `${this.config.baseUrl}/stories?token=${this.config.token}&version=draft&per_page=${this.config.perPage}`;
        response = await fetch(url);
      }

      if (!response.ok) {
        throw new Error(`Storyblok API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const stories = data.stories || [];

      this.logger.success(`Retrieved ${stories.length} stories from Storyblok`);

      // Log some debug info about the stories
      if (stories.length > 0) {
        this.logger.info(`First story example: ${JSON.stringify({
          id: stories[0].id,
          slug: stories[0].slug,
          published_at: stories[0].published_at,
          hasContent: !!stories[0].content,
          hasBody: !!(stories[0].content && stories[0].content.body)
        }, null, 2)}`);
      }

      return stories;

    } catch (error) {
      this.logger.error('Failed to fetch stories from Storyblok', error);
      throw error;
    }
  }

  /**
   * Validate story structure
   * @param {Object} story - Story object to validate
   * @returns {boolean} Whether story is valid
   */
  validateStoryStructure(story) {
    return story &&
           story.id &&
           story.slug &&
           story.content &&
           Array.isArray(story.content.body);
  }

  /**
   * Filter stories to only include those with relevant content components
   * @param {Array} stories - Array of stories to filter
   * @returns {Array} Filtered stories
   */
  filterRelevantStories(stories) {
    const relevantComponentTypes = ['cafe', 'event'];

    return stories.filter(story => {
      if (!this.validateStoryStructure(story)) {
        return false;
      }

      return story.content.body.some(block =>
        relevantComponentTypes.includes(block.component)
      );
    });
  }
}

export default StoryblokService;