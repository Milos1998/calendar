import { useRouter } from "next/router";

const Meeting= () => {
    const router= useRouter()
    const id= router.query

    console.log(id);
    
    return <div>
        Sastanak
    </div>
}

export default Meeting