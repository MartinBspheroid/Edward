import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Dropzone, DropzoneProps, FileWithPath } from '@mantine/dropzone';
import { Button, Divider, Group, NumberInput, ScrollArea, Text } from '@mantine/core';
import { convertToSeconds, Timestamp } from './Exporter';
import { TimeInput } from '@mantine/dates';
import AppContext from './AppContext';


const DEFAULT_DURATION = 10;

function Time() {


  const [date, onChange] = useState(new Date());
  const [fileTimeStamps, setFileTimeStamps] = useState<Timestamp[]>([]);
  const [errorTime, setErrorTime] = useState(false);

  const { setTimeOffset, setTimestamps, duration, setDuration, timestamps, beforeTime, setBeforeTime } = useContext(AppContext)

  useEffect(() => {

    /// set the time offset 

    /// construct the string as hh:mm:ss
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const newTime = convertToSeconds(`${hours}:${minutes}:${seconds}`)
    setTimeOffset(newTime)
    /// get 
    if (timestamps.length > 0) {
      /// get the first timestamp
      if (timestamps[0].time < newTime) {
        setErrorTime(true)
      } else {
        setErrorTime(false)
      }
    }

  }, [date])


  const parseTable = useCallback((files: FileWithPath[]) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // console.log(e.target?.result);

      if (e.target) {
        const text = e.target.result as string;
        const lines = text.split('\n');
        const timestamps: Timestamp[] = []

        lines.forEach((line) => {
          /// test if time is valid using regex (hh:mm:ss)
          const regex = /^([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
          const time = line.match(regex);
          if (time) {
            timestamps.push({
              originalTime: line,
              time: convertToSeconds(line)
            })
          }
        });
        console.log(timestamps);

        setFileTimeStamps(timestamps.sort((a, b) => a.time - b.time));
        setTimestamps(timestamps.sort((a, b) => a.time - b.time));
      }
    };
    reader.readAsText(files[0]);
  }, [])

  return (
    <div className='box'>
      <h6>Time</h6>
      <Divider/>

      {
        fileTimeStamps.length === 0 &&
        <Dropzone
          onDrop={(files) => parseTable(files)}
          onReject={(files) => console.log('rejected files', files)}
          // maxSize={3 * 1024 ** 2}
          accept={["text/csv"]}

        >
          <Group position="center" spacing="xl" style={{ minHeight: 100, pointerEvents: 'none' }}>
            <Dropzone.Accept>

            </Dropzone.Accept>
            <Dropzone.Reject>

            </Dropzone.Reject>
            <Dropzone.Idle>

            </Dropzone.Idle>

            <div>
              <Text
                style={{ color: 'black' }}
                size="xl">
                Drag timestamps here or click to select files
              </Text>

            </div>

          </Group>
        </Dropzone>
      }

      {
        fileTimeStamps.length > 0 &&
        <div>
          <h6>{timestamps.length } time stamps</h6>


          <Group grow

          >
            <div>
              <ScrollArea
                style={{
                  height: "100px",
                }}
              >
                <ul>
                  {fileTimeStamps.map((timestamp, index) => (
                    <li key={index}>{timestamp.originalTime}</li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            <div>
              <TimeInput label="Start time of video"
                error={errorTime ? "Start time is after first timestamp" : ""}
                withSeconds value={date} onChange={onChange} />
              <NumberInput
                label="Duration (seconds)"
                defaultValue={duration}
                placeholder="Duration"
                radius="xs"
                onChange={(value) => {
                  if (value) {
                    setDuration(value)
                  }
                }} />
              <NumberInput
                label="Before time (seconds)"
                defaultValue={beforeTime}
                placeholder="Before time"
                radius="xs"
                onChange={(value) => {
                  if (value) {
                    setBeforeTime(value)
                  }
                }} />
            </div>
          </Group>


          <Button onClick={
            () => setFileTimeStamps([])
          }>Clear</Button>

        </div>



      }

    </div>
  )
}

export default Time