
export default function TimeSlotPicker({ selectedSlot, onSelect }) {
    // Generate slots from 11:00 AM to 3:00 PM
    const slots = [
        "11:00 - 11:15", "11:15 - 11:30", "11:30 - 11:45", "11:45 - 12:00",
        "12:00 - 12:15", "12:15 - 12:30", "12:30 - 12:45", "12:45 - 01:00",
        "01:00 - 01:15", "01:15 - 01:30", "01:30 - 01:45", "01:45 - 02:00",
    ];

    return (
        <div className="space-y-4">
            <h3 className="font-bold text-gray-800 text-lg">Select Pickup Time</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {slots.map((slot) => (
                    <button
                        key={slot}
                        onClick={() => onSelect(slot)}
                        className={`
              py-3 px-4 rounded-xl text-sm font-medium border transition-all
              ${selectedSlot === slot
                                ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-primary hover:text-primary'
                            }
            `}
                    >
                        {slot}
                    </button>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
                * Please arrive on time to collect your order.
            </p>
        </div>
    );
}
