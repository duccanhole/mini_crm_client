import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/vi';
import 'dayjs/locale/en';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone to Vietnam
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

// You can also set the locale based on the app's current locale elsewhere, 
// but we'll default to 'vi' here.
dayjs.locale('vi');

export default dayjs;
