import React from 'react'
import ThreeDLayers from './components/ThreeDLayers';

const App = () => {
  return (
    <div className="App w-screen h-screen bg-black">
      <ThreeDLayers numLayers={30} />
    </div>
  );
}

export default App;
