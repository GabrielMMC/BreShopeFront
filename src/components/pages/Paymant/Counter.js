import React from 'react'

const Counter = ({ handleClose }) => {
 const [totalTime, setTotalTime] = React.useState(5 * 60)

 React.useEffect(() => {
  if (totalTime !== 0) setTimeout(() => setTotalTime(totalTime - 1), 1000)
  else handleClose(false)
 }, [totalTime])

 const minutes = Math.floor(totalTime / 60)
 const seconds = totalTime % 60

 return (
  <div className='d-flex justify-content-center display-6'>
   <span>{minutes.toString().padStart(2, "0")}</span>
   <span>:</span>
   <span>{seconds.toString().padStart(2, "0")}</span>
  </div>
 )
}

export default Counter