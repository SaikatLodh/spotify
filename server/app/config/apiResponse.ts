class ApiResponse {
  status: number;
  data: any;
  message: string;
  constructor(status: number, data: any, message: string) {
    this.status = status;
    this.data = data;
    this.message = message;
  }
}

export default ApiResponse;