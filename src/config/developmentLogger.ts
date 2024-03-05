import winston from 'winston';
import moment from 'moment';
import WinstonCloudWatch from 'winston-cloudwatch';
import * as conf from '../config/index'

const { combine, timestamp, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} - [${level}] - ${message}`;
});
// console.log("conf.AWS_CLOUDWATCH_KEY : ",conf.AWS_CLOUDWATCH_KEY , ' : ', AWS_CLOUDWATCH_SECRET)

const logger = () => {
  return winston.createLogger({
    level: 'debug',
    format: combine(
      winston.format.simple(),
      timestamp({ format: moment().format('YYYY-MM-DD hh:mm:ss').trim() }),
      myFormat
    ),
    transports: [
      new winston.transports.Console(),
      // Configure WinstonCloudWatch transport
      new WinstonCloudWatch({
        logGroupName: conf.AWS_GROUP_NAME,
        logStreamName: conf.AWS_STREAM_NAME,
        awsRegion: conf.AWS_CLOUDWATCH_REGION,
        awsOptions: {
          credentials : {
            accessKeyId : conf.AWS_CLOUDWATCH_KEY!,
            secretAccessKey : conf.AWS_CLOUDWATCH_SECRET!
          }
        }
      })
    ]
  });
};

export default logger;
