export enum MessageType {
  SUCCESS,
  DANGER,
  WARNING,
}
export interface UserMessage {
  showMessage: boolean;
  message: string;
  titleMessage?: string;
  type: MessageType; // error , danger , etc
}
export interface IMessageComponent {
  userMessage: UserMessage;
}
