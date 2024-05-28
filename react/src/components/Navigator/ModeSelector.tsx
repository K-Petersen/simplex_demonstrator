import { Dispatch, SetStateAction } from "react";
import { Mode } from "constants/mode";

interface ModeSelectorProps {
    setMode: Dispatch<SetStateAction<Mode>>,
}

export function ModeSelector(props: ModeSelectorProps){
    const {setMode} = {...props};

    return(
        <button onClick={() => setMode(Mode.TYPE_IN)}></button>
    )
}