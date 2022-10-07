const { ipcRenderer } = require("electron");

import { Button, Divider, ScrollArea, Space, Title } from '@mantine/core'
import React, { useCallback, useContext, useEffect } from 'react'
import AppContext from './AppContext';



const templateORIGINAL = `start "" ffmpeg/bin/ffmpeg.exe -i test.mp4 -ss 00:00:03 -t 00:00:08 -async 1 cut.mp4`
const template = `start "" /wait ffmpeg/bin/ffmpeg.exe -i INPUTPATH -ss IN_TIME -t DURATION -async 1 OUTPUT_FILE_NAME`



export interface Timestamp {
  originalTime: string;
  time: number
}

export interface ExporterData {
  inputVideoPath: string
  timestamps: Timestamp[]

}


/// convert time from seconds to hh:mm:ss
function convertToSeconsAsString(time: number): string {
  const hours = Math.floor(time / 3600)
  const minutes = Math.floor((time % 3600) / 60)
  const seconds = Math.floor(time % 60)

  const hoursString = hours < 10 ? `0${hours}` : `${hours}`
  const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`
  const secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`

  return `${hoursString}:${minutesString}:${secondsString}`
}

export function convertToSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(':').map((time) => Number(time))
  const timeNumber = hours * 3600 + minutes * 60 + seconds
  return timeNumber
}

function Exporter() {


  const { outputFolderPath, setOutputFolderPath, timestamps, timeOffset, videoPath, duration, beforeTime } = useContext(AppContext)

  const [scriptContent, setScriptContent] = React.useState<string>('')
  const [showScript, setShowScript] = React.useState(false)

  useEffect(() => {
    
    ipcRenderer.on("selectedDirectory", (event, path) => {
      console.log("selectedDirectory", path);
      
      setOutputFolderPath(path)
      })
  }, [])




  const buildBatchFile = useCallback((data: ExporterData) :string=> {


    let script = `@echo off`
    
    for (let i = 0; i < data.timestamps.length; i++) {
      script += "\n"
      const element = data.timestamps[i];
      /// replace the template with the data 
      /// INPUTPATH is inputVideoPath
      /// IN_TIME is startTime converted to hh:mm:ss
      /// DURATION is duration converted to hh:mm:ss
      /// OUTPUT_FILE_NAME is outputFolderPath + i
      let line = template.replace('INPUTPATH', `"${data.inputVideoPath}"`)
      line = line.replace('IN_TIME', convertToSeconsAsString(element.time - timeOffset - beforeTime))
      line = line.replace('DURATION', convertToSeconsAsString(duration))
      line = line.replace('OUTPUT_FILE_NAME', `"${outputFolderPath.replace(/\\/g, '/')+ "/video" + i +  + `${element.originalTime}` + ".mp4"}"`)
      script += line
    }
    return script


  }, [duration, timeOffset, timestamps, videoPath, outputFolderPath])


  useEffect(() => {
    /// rebuild the script when the data changes
    const script = buildBatchFile({ inputVideoPath: videoPath, timestamps: timestamps })
    setScriptContent(script)


  }, [timestamps, videoPath, outputFolderPath, duration, timeOffset])
  return (
    <div className='box'>
      <Title order={6}>

        Export

      </Title>
      <Divider/>
      {
          showScript && 
        <ScrollArea>
        <code
          style={{
            display: 'block',
            whiteSpace: 'pre',
            fontFamily: 'monospace',
            fontSize: '1rem',
            lineHeight: '1.5rem',
            padding: '1rem',
            
          }}
        >
          {scriptContent}
        </code>

        </ScrollArea>}
        {outputFolderPath && <p>Output folder: {outputFolderPath}</p>}
      <div
        style={{
          display: 'flex',
          flexDirection: "column",
          width:"200px"
        }}
      
      >
        <Space h={20}/>
        <Button

          onClick={() => {
            ipcRenderer.invoke("showDialog", "message");
          }}
        >
          Select directory
        </Button>
        <Space h={20}/>
        <Button
        disabled={!outputFolderPath}
          onClick={() => {
            ipcRenderer.invoke("save", scriptContent);
          }}
        >
          Export
        </Button>
        <Space h={20}/>
        <Button
        
          onClick={() => {
            setShowScript(!showScript)
          }}
        >
          Show script
        </Button>

      </div>
    </div>
  )
}

export default Exporter