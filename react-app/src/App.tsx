import './App.css'

function renderTitle(): string {
  return 'Plant Tracker'
}

function App() {
  return (
    <>
      <section id="center">
        <div>
          <h1>{renderTitle()}</h1>
          <ul>
            <li key="plant-1">Plant 1</li>
            <li key="plant-2">Plant 2</li>
            <li key="plant-3">Plant 3</li>
          </ul>
        </div>
      </section>
    </>
  )
}

export default App
