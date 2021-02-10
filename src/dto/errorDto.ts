export default class ErrorDto {
  constructor(private message: string, private status: number) {
    this.message = message;
    this.status = status;
  }

  get getMessage() {
    return this.message;
  }
  get getStatus() {
    return this.status;
  }
}
