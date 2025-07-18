import PortActivityPage from "@/components/PortActivity"

const page = async ({params} : {params : Promise<{slug : string}>}) => {
  const {slug} = await params
  return (
   <PortActivityPage portSlug={slug}/>
  )
}

export default page