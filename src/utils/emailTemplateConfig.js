export const EMAIL_TEMPLATE_TYPES = {
  DELIVERY_SCHEDULED: {
    id: 'delivery_scheduled',
    title: 'Delivery Scheduled',
    trigger: 'Sent when a route is published',
    tags: ['{stop_name}', '{notes}', '{eta_window}', '{date}'],
    defaultSubject: 'Your delivery is scheduled for {date}',
    defaultTemplate: 'Hi {stop_name},\n\nYour delivery has been scheduled for {date} between {eta_window}.\n\nThank you for choosing us!'
  },
  OUT_FOR_DELIVERY: {
    id: 'out_for_delivery',
    title: 'Out for Delivery',
    trigger: 'Sent when the driver is approaching (e.g., 30 min away)',
    tags: ['{stop_name}', '{notes}', '{minutes_away}'],
    defaultSubject: 'Your delivery is {minutes_away} minutes away!',
    defaultTemplate: 'Hi {stop_name},\n\nGreat news! Your driver is {minutes_away} minutes away.\n\nPlease ensure someone is available to receive the delivery.\n\nThank you!'
  },
  DELIVERY_COMPLETED: {
    id: 'delivery_completed',
    title: 'Delivery Completed',
    trigger: 'Sent when the driver marks the order Delivered in the app',
    tags: ['{stop_name}', '{notes}', '{completed_time}'],
    defaultSubject: 'Your delivery has been completed',
    defaultTemplate: 'Hi {stop_name},\n\nYour delivery was successfully completed at {completed_time}.\n\nWe hope you enjoy your order! Thank you for choosing us.\n\nIf you have any questions or concerns, please don\'t hesitate to reach out.'
  },
  DELIVERY_MISSED: {
    id: 'delivery_missed',
    title: 'Delivery Missed',
    trigger: 'Sent when the driver marks the order as not completed (taps the X button)',
    tags: ['{stop_name}', '{notes}', '{skip_time}'],
    defaultSubject: 'We missed you - delivery attempted at {skip_time}',
    defaultTemplate: 'Hi {stop_name},\n\nWe attempted to deliver your order at {skip_time}, but we were unable to complete the delivery.\n\nPlease contact us to reschedule your delivery at your earliest convenience.\n\nWe apologize for any inconvenience and look forward to serving you soon.'
  }
}
