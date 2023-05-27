// FSJS2.0 9th feb-mega project
// asyncHandler is a service like higher order function , that handles exixution failures

const asyncHandler= (fn) => async (req,res,next)=>{
    try{
        await fn(req, res, next)
    }
    catch (error){
        res.status(error.code || 500).JSON({
            sucess : false,
            message : error.message
        })
    }
}


export default asyncHandler