export const TEMPLATE_TYPES = {
  DELIVERY_SCHEDULED: {
    id: 'delivery_scheduled',
    title: 'Delivery Scheduled',
    trigger: 'Sent when a route is published',
    tags: ['{stop_name}', '{notes}', '{eta_window}', '{date}'],
    defaultTemplate: 'Hi {stop_name}, your delivery is scheduled for {date} between {eta_window}. Track it here: [link]'
  },
  OUT_FOR_DELIVERY: {
    id: 'out_for_delivery',
    title: 'Out for Delivery',
    trigger: 'Sent when the driver is approaching (e.g., 30 min away)',
    tags: ['{stop_name}', '{notes}', '{minutes_away}'],
    defaultTemplate: 'Hi {stop_name}, your driver is {minutes_away} minutes away! Track your delivery here: [link]'
  },
  DELIVERY_COMPLETED: {
    id: 'delivery_completed',
    title: 'Delivery Completed',
    trigger: 'Sent when the driver marks the order Delivered in the app',
    tags: ['{stop_name}', '{notes}', '{completed_time}'],
    defaultTemplate: 'Hi {stop_name}, your delivery was completed at {completed_time}. Thank you for choosing us!'
  },
  DELIVERY_MISSED: {
    id: 'delivery_missed',
    title: 'Delivery Missed',
    trigger: 'Sent when the driver marks the order as not completed (taps the X button)',
    tags: ['{stop_name}', '{notes}', '{skip_time}'],
    defaultTemplate: 'Hi {stop_name}, we attempted delivery at {skip_time} but were unable to complete it. Please contact us to reschedule.'
  }
}
