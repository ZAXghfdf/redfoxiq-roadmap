class StorageManager {
  constructor() {
    this.keys = {
      progress: 'redfoxiq_progress',
      favorites: 'redfoxiq_favorites',
      settings: 'redfoxiq_settings'
    };
  }

  getProgress() {
    try {
      const data = localStorage.getItem(this.keys.progress);
      return data ? JSON.parse(data) : { completedStages: [], completedCourses: [] };
    } catch (e) {
      console.warn('Error reading progress:', e);
      return { completedStages: [], completedCourses: [] };
    }
  }

  saveProgress(progress) {
    try {
      localStorage.setItem(this.keys.progress, JSON.stringify(progress));
      return true;
    } catch (e) {
      console.warn('Error saving progress:', e);
      return false;
    }
  }

  getFavorites() {
    try {
      const data = localStorage.getItem(this.keys.favorites);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Error reading favorites:', e);
      return [];
    }
  }

  saveFavorites(favorites) {
    try {
      localStorage.setItem(this.keys.favorites, JSON.stringify(favorites));
      return true;
    } catch (e) {
      console.warn('Error saving favorites:', e);
      return false;
    }
  }

  exportData() {
    return {
      progress: this.getProgress(),
      favorites: this.getFavorites(),
      exportedAt: new Date().toISOString()
    };
  }

  importData(data) {
    if (data.progress) this.saveProgress(data.progress);
    if (data.favorites) this.saveFavorites(data.favorites);
  }

  clearAll() {
    localStorage.removeItem(this.keys.progress);
    localStorage.removeItem(this.keys.favorites);
  }
}
