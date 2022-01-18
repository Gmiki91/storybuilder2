class AppError extends Error{
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
        this.status=`${statusCode}`.startsWith('4') ? 'fail' :'error';
        this.isOperational=true;

        //Exclude this constructor from the stacktrace
        Error.captureStackTrace(this,this.constructor); 
    }
}