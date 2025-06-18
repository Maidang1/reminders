


use chrono::{Local, Timelike};

pub fn get_current_time()->(u32, u32) {

  let now = Local::now();
  let hour = now.hour();
  let minutes = now.minute();
  (hour, minutes)
}
