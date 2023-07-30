import Image from "next/image";
import { VscAccount } from "react-icons/vsc";
type ProfileImageprops ={
    src?: string | null
    className? : string


}
export default function ProfileImage({src, className=""}:ProfileImageprops){
        
    return ( <div className={`relative h-12 w-12 overflow-hidden
    rounded-full ${className}`}>
        {src == null ? <VscAccount className="w-full h-full" /> : <Image src={src} alt="profile" quality={100} fill /> }
    </div>
    );
}