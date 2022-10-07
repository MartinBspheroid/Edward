import React, { useContext } from 'react'

import { Dropzone, DropzoneProps, FileWithPath } from '@mantine/dropzone';
import { Divider, Group, Text } from '@mantine/core';
import AppContext from './AppContext';

function Video() {


  const { setVideoPath, videoPath } = useContext(AppContext)
  const [showVideo, setShowVideo] = React.useState(false)


  const processVideo = (video: FileWithPath) => {
    if (video.path) {
      setVideoPath(video.path)
      setShowVideo(true)
    }
  }


  return (
    <div className='box' >
      <h6>Video</h6>
      <Divider/>
      {!showVideo && <Dropzone
        onDrop={(files) => { processVideo(files[0]) }}
        onReject={(files) => console.log('rejected files', files)}
        // maxSize={3 * 1024 ** 2}
        accept={["video/*"]}

      >
        <Group position="center" spacing="xl" style={{ minHeight: 100, pointerEvents: 'none' }}>
          <Dropzone.Accept>

          </Dropzone.Accept>
          <Dropzone.Reject>

          </Dropzone.Reject>
          <Dropzone.Idle>

          </Dropzone.Idle>

          <div>
            <Text size="xl" style={{
              color: 'black'
            }}>
              Drag video here or click to select file
            </Text>

          </div>

        </Group>
      </Dropzone>
      }
      {showVideo && <div>
        <video
          style={{
            width: '100%',
            height: "auto",
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: '10px'
          }}
          src={videoPath} controls />
        
        <div>
          <p>
            {videoPath}
          </p>
          </div>
      </div>
          
        }


    </div>
  )
}

export default Video