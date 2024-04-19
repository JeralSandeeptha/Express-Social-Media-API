class ErrorResponse {
    
    constructor(statusCode, message, data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    //this code is for check sonarcube status
    static defaultSuccess() {
        return new SuccessResponse(200, "Error", "Error");
    }
}

module.exports = ErrorResponse;