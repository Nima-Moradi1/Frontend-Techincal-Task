
const MaxWidthWrapper = ({children} : {children : React.ReactNode}) => {
  return (
    <div className="p-4 w-full max-w-screen bg-slate-100 min-h-screen">
        {children}
    </div>
  )
}

export default MaxWidthWrapper