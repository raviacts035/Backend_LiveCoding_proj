// asyncHandler is a service like higher order function , that handles exixution failures

const asyncHandler= (fn) => async (req,res)=>{
    try{
        await fn(req, res)
    }
    catch (error){
        res.status(error.code || 500).json({
            sucess : false,
            message : error.message
        })
    }
}


export default asyncHandler