import { Box, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export const useOfferNotificationHook = () => {
    // Custom hook logic here
    const showNotification = (message) => {
        // Logic to show notification
        alert(message); // Example using alert, replace with actual notification logic
    };

    const { previousNotificationTime } = useSelector((state) => state.notification)

    const [notifications, setNotifications] = useState([])
    const [callNotification, setCallNotification] = useState(false)
    const [callCounts, setCallCounts] = useState(0)
    const [timer, setTimer] = useState(1000*60*5)
    useEffect(() => {
        // setCallNotification(false)
        let timerEvent
        if (callCounts < 4) {
            timerEvent = setTimeout(() => {
                setCallNotification(true)
                setCallCounts(callCounts + 1)
                setTimer(1000*60*20)
            }, timer);
        }

        return () => clearTimeout(timerEvent);
    }, [callCounts])


    useEffect(() => {
        if(callNotification){
            setTimeout(() => {
                setCallNotification(false)
            }, 1000*60);
        }
    },[callNotification])


    console.log('callNotification', callNotification)
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
  boxShadow: 24,
     width:'80dvw',
     border:'0px solid #000',
//   p: 4,
};
    const NotificationsJSX = ()=>{
        return(
        <Modal
            open={callNotification}
        onClose={()=>setCallNotification(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} >
                 <button
    onClick={() => setCallNotification(false)}
    style={{
      position: 'absolute',
      top: 4,
      right: 4,
      background: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: 32,
      height: 32,
      fontSize: 20,
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      zIndex: 2,
      lineHeight: 1,
      padding: 0,
   
    }}
    aria-label="Close"
   
  >
    ×
  </button>
                <img
                style={{width:'100%'}}
                src={'/assets/offer.gif'}
                ></img>
            </Box>
        </Modal>
    )
}

    return { NotificationsJSX };
};