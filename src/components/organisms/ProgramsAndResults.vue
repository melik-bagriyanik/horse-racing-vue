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
        'Betty Holberton',
      ],
    },
  },
  methods: {
    getHorseNameForPosition(position, roundId) {
      // Simple logic to assign horse names to positions
      const index = (position + roundId - 1) % this.horseNames.length
      return this.horseNames[index]
    },
  },
}
</script>

<style scoped>
.program-panel,
.results-panel {
  position: relative;
  overflow: hidden;
}

.program-panel h3,
.results-panel h3 {
  position: sticky;
  top: 0;
  background: rgb(218, 255, 95);
  z-index: 10;
  padding: 15px 15px 15px 15px;
  margin: -15px -15px 15px -15px;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: black;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}
.programs-and-results {
  display: flex;
  min-height: 650px;
  height: 90vh;

  overflow: auto;
  width: 500px;
  background-color: rgb(218, 255, 95);
}

.program-panel,
.results-panel {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex: 1;
  overflow-y: auto;
  max-height: 100%;
}

.rounds-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 15px 15px 15px;
}

.round-section {
  background: #ffec1d;
  border-radius: 10px;
  border-radius: 6px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.round-section h4 {
  color: black;
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
  color: black;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
}

.round-table td {
  color: #515151;
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
