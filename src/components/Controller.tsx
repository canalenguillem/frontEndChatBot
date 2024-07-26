import { useState } from "react"
import RecordMessage from "./RecordMessage";


import Title from "./Title"
import axios from "axios";
function Controller() {
    const [isLoading,setIsLoading]=useState(false);
    const [messages, setMessages] = useState<any[]>([]);


    const createBlobUrl = (data: any) => {
      const blob = new Blob([data],{type:"audio/mpeg"})
      const url=window.URL.createObjectURL(blob)
      return url
    };

    const handleStop = async (blobUrl:string)=>{
      setIsLoading(true)
      const myMessage = {sender:"me",blobUrl}
      const messageArr =[...messages,myMessage]

      //convertir la url a un objeto blob
      fetch(blobUrl)
        .then((res)=>res.blob())
        .then(async(blob)=>{
          //construir el audio para enviar al servidor
          const formData = new FormData();
          formData.append("file",blob,"mifichero.wav")

          //enviar el audio al servidor

          await axios
            .post("http://localhost:8000/post-audio",formData,{
              headers:{"Content-Type":"audio/mpeg"},
              responseType:"arraybuffer"
            })
            .then((res:any)=>{
              const blob=res.data
              const audio=new Audio()
              audio.src=createBlobUrl(blob)

              //añadir el mensaje a la lista
              const assistantMessage={
                sender:"assistant",
                blobUrl:audio.src
              }
              messageArr.push(assistantMessage)
              setMessages(messageArr)

              console.log(messages)

              audio.play()
            })

        
        })














      setIsLoading(false)
    };

  return (
    <div className="h-screen  overflow-y-hidden">
      <Title setMessages={setMessages} />
      <div className="flex flex-col  justify-between h-full overflow-scroll pb-96">
        {/** GRABACIONES */}
        {messages.map((audio,index)=>{
          return(
          <div
              key={index + audio.sender}
              className={"flex flex-col "+(audio.sender=="assistant" && "items-end")}
          >
            <div>
              <p className={audio.sender=="assistant" ? "text-right mr-2 text-green-500 italic":"ml-2 text-blue-500 italic"}>
                {audio.sender}
              </p>
              {/**componente de audio */}
              <audio 
                src={audio.blobUrl}
                controls
              />
            </div>  
          </div>)
        })}
        <div className="fixed bottom-0 w-full py-6 border-t text-center bg-green-500">
          <div className="flex justify-center items-center w-full">
            <RecordMessage handleStop={handleStop} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Controller