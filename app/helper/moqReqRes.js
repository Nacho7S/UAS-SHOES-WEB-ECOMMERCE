import { createResponse } from "./createResponse";

export let responseData = null;
export let responseStatus = 200;
export let hasToken = false;
export let tokenValue = null;

export const mockRes = {
      status: function(code){
        responseStatus = code
        return this
      },
      json: function(data){
        responseData = data
        
        if (data.success && data.token) {
          hasToken = true;
          tokenValue = data.token;
        }

        return createResponse(data, responseStatus)
      }
};
    

export const mockReq = (req) => {
  return  req ;
}