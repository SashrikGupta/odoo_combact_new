import React , {useEffect , useContext , createContext , useState} from 'react'

export const curr_context = createContext();

export default function Trainee(props) {
   const backend_url = "http://localhost:7000"
   const traineeID = "666e1fbb59ee8810d3a8b04f"
   const [trainee , set_trainee] = useState(null) ; 

   useEffect(()=>{
     

      const get_data = async()=>{
         if(traineeID){

            const url = backend_url + "/trainee"+"/get_trainee_info/" + traineeID
            await fetch(url, {
               method: 'GET',
               headers: {
                   'Cache-Control': 'no-cache, no-store, must-revalidate', 
                   'Pragma': 'no-cache',
                   'Expires': '0'
               }
           })
           .then(res => res.json())
           .then(res => set_trainee(res))
           .catch(error => console.error('Error:', error));
         }
      } 
       get_data() ; 
   } , [traineeID])

   useEffect(() => {
      console.log(trainee);
    }, [trainee]);


   return (
      <>
        <curr_context.Provider value={{traineeID ,trainee , set_trainee , backend_url}}>
          {props.children}
        </curr_context.Provider>
      </>
    );
  }

