import { useContext, useState } from 'react'

import './App.css'
import AppContext from './AppContext'
import Exporter from './Exporter'
import Time from './Time'
import Video from './Video'

function App() {
  const { timestamps, videoPath } = useContext(AppContext)
  return (
    <div className="App">
      
      <Time/>
      {timestamps.length > 0 && <Video/>}
      
    
    {videoPath && <Exporter/>}
      </div>

    


  )
}

export default App
