<template>
  <div class="programs-and-results">
    <div class="program-panel">
      <h3>Program</h3>
      <div class="rounds-container">
        <div v-for="round in rounds" :key="round.id" class="round-section">
          <h4>{{ round.id }}ST Lap - {{ round.distance }}m</h4>
          <table class="round-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="position in 10" :key="position">
                <td>{{ position }}</td>
                <td>{{ getHorseNameForPosition(position, round.id) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <div class="results-panel">
      <h3>Results</h3>
      <div class="rounds-container">
        <div v-for="round in rounds" :key="round.id" class="round-section">
          <h4>{{ round.id }}ST Lap - {{ round.distance }}m</h4>
          <table class="round-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="position in 10" :key="position">
                <td>{{ position }}</td>
                <td>{{ getHorseNameForPosition(position, round.id) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgramsAndResults',
  props: {
    rounds: {
      type: Array,
      default: () => [
        { id: 1, distance: 1200 },
        { id: 2, distance: 1400 },
        { id: 3, distance: 1600 },
        { id: 4, distance: 1800 },
        { id: 5, distance: 2000 },
        { id: 6, distance: 2200 },
      ],
    },
    horseNames: {
      type: Array,
      default: () => [
        'Ada Lovelace',
        'Grace Hopper', 
        'Margaret Hamilton',
        'Joan Clarke',
        'Katherine Johnson',
        'Dorothy Vaughan',
        'Mary Jackson',
        'Annie Easley',
        'Frances Spence',
        'Betty Holberton'
      ],
    },
  },
  methods: {
    getHorseNameForPosition(position, roundId) {
      // Simple logic to assign horse names to positions
      const index = (position + roundId - 1) % this.horseNames.length
      return this.horseNames[index]
    }
  }
}
</script>

<style scoped>
.programs-and-results {
  display: flex;
  gap: 20px;
  width: 600px;
}

.program-panel,
.results-panel {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex: 1;
}

.program-panel h3,
.results-panel h3 {
  color: #fff;
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

.rounds-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.round-section {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.round-section h4 {
  color: #fff;
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.round-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.round-table th,
.round-table td {
  padding: 6px 8px;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.round-table th {
  color: #fff;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
}

.round-table td {
  color: #e0e0e0;
}

.round-table tr:hover {
  background: rgba(255, 255, 255, 0.03);
}

/* Responsive design */
@media (max-width: 768px) {
  .programs-and-results {
    flex-direction: column;
    width: 100%;
  }
}
</style>
