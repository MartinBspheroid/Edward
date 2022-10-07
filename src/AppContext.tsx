import { createContext, useState } from "react";
import { Timestamp } from "./Exporter";

interface IAppContext {
    timeOffset: number;
    setTimeOffset: (timeOffset: number) => void;
    videoPath: string;
    setVideoPath: (videoPath: string) => void;
    outputFolderPath: string;
    setOutputFolderPath: (outputFolderPath: string) => void;
    timestamps: Timestamp[];
    setTimestamps: (timestamps: Timestamp[]) => void;

    duration: number;
    setDuration: (duration: number) => void;

    beforeTime: number;
    setBeforeTime: (beforeTime: number) => void;

}

const AppContext = createContext({} as IAppContext);

export default AppContext;


/// create a context provider
 export const AppContextProvider = (props: { children: React.ReactNode }) => {
    const [timeOffset, setTimeOffset] = useState(0);
    const [videoPath, setVideoPath] = useState("");
    const [outputFolderPath, setOutputFolderPath] = useState("");
    const [timestamps, setTimestamps] = useState<Timestamp[]>([]);
    const [duration, setDuration] = useState(30);
    const [beforeTime, setBeforeTime] = useState(30);

    return (
        <AppContext.Provider
            value={{
                timeOffset,
                setTimeOffset,
                videoPath,
                setVideoPath,
                outputFolderPath,
                setOutputFolderPath,
                timestamps,
                setTimestamps,
                duration,
                setDuration,
                beforeTime,
                setBeforeTime,

            }}
        >
            {props.children}
        </AppContext.Provider>
    );
}
