import { ReactMediaRecorder } from "react-media-recorder";
import RecordIcon from "./RecordIcon";

type Props = {
    handleStop: any;
  };

function RecordMessage({handleStop}:Props) {
  return (
    <ReactMediaRecorder
        audio
        onStop={handleStop}
        render={({status,startRecording,stopRecording})=>(
            <div className="mt-2">
                <button className="bg-white p-4 rounded-full"
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                >
                    <RecordIcon
                        classText=
                        { status=="recording" ? "animate-pulse text-red-500" : "text-green-400" }
                    />
                </button>
                <p className="mt-2 text-white font-light">{status}</p>
            </div>
        )
    }
    />
  )
}

export default RecordMessage