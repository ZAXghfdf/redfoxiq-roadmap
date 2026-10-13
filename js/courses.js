class CoursesManager {
  constructor() {
    this.courses = [];
    this.roadmap = null;
  }

  async loadData() {
    try {
      const [coursesRes, roadmapRes] = await Promise.all([
        fetch('./data/courses.json'),
        fetch('./data/roadmap.json')
      ]);
      this.courses = await coursesRes.json();
      this.roadmap = await roadmapRes.json();
      return { courses: this.courses, roadmap: this.roadmap };
    } catch (e) {
      console.error('Error loading data:', e);
      return { courses: [], roadmap: null };
    }
  }

  getCoursesByStage(stageId) {
    return this.courses.filter(c => c.stageId === stageId);
  }

  getCoursesByTrack(trackId) {
    return this.courses.filter(c => c.track === trackId);
  }

  getStats() {
    const totalCourses = this.courses.length;
    const redTeamCourses = this.courses.filter(c => c.track === 'redteam').length;
    const blueTeamCourses = this.courses.filter(c => c.track === 'blueteam').length;
    const freeCourses = this.courses.filter(c => c.accessType === 'free').length;
    return {
      totalTracks: this.roadmap?.tracks?.length || 0,
      totalStages: this.roadmap?.tracks?.reduce((acc, t) => acc + (t.stages?.length || 0), 0) || 0,
      totalCourses,
      redTeamCourses,
      blueTeamCourses,
      freeCourses
    };
  }

  searchCourses(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return this.courses.filter(c => 
      c.title.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(q))) ||
      (this.getStageTitle(c.stageId).toLowerCase().includes(q)) ||
      (this.getTrackName(c.track).toLowerCase().includes(q))
    );
  }

  getStageTitle(stageId) {
    if (!this.roadmap) return '';
    for (const track of this.roadmap.tracks) {
      const stage = track.stages.find(s => s.id === stageId);
      if (stage) return stage.title;
    }
    return '';
  }

  getTrackName(trackId) {
    if (!this.roadmap) return '';
    const track = this.roadmap.tracks.find(t => t.id === trackId);
    return track ? track.name : '';
  }

  getTrackColor(trackId) {
    if (!this.roadmap) return '#dc2626';
    const track = this.roadmap.tracks.find(t => t.id === trackId);
    return track ? track.color : '#dc2626';
  }
}
