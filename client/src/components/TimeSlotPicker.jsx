
export default function TimeSlotPicker({ selectedSlot, onSelect }) {
    // Generate slots from 1:00 PM to 1:45 PM
    const slots = [
        "1:00 - 1:15", "1:15 - 1:30", "1:30 - 1:45"
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
