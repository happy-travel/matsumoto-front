import { API, redirect } from "core";
import { PAYMENT_METHODS } from "enum";
import { $accommodation, $notifications, $payment } from "stores";

const taskSubmitBookingForm = (values, { setSubmitting }) => {
    if (!$accommodation.selected?.accommodationFinal?.accommodation?.id) {
        setSubmitting(false);
        $notifications.addNotification("Booking unsuccessful, please try again later or contact us for help.");
        return null;
    }

    var contract = $accommodation.selected.roomContractSet,
        search = $accommodation.search.request;

    var roomDetails = [];

    for (var r = 0; r < contract?.rooms?.length; r++) {
        var adults = contract?.rooms[r]?.adultsNumber,
            total = adults + contract?.rooms[r]?.childrenAges.length,
            passengers = [];

        for (var i = 0; i < total; i++)
            passengers.push({
                title: values.room[r].passengers[i].title,
                firstName: values.room[r].passengers[i].firstName,
                lastName: values.room[r].passengers[i].lastName,
                age: i < adults ? 35 : contract?.rooms[r]?.childrenAges[i-adults],
                ...( i == 0 ? { isLeader: true } : {} )
            });

        roomDetails.push({
            type: contract.rooms[r]?.type,
            passengers
        })
    }

    var request = {
        searchId: $accommodation.search.id,
        resultId: $accommodation.selected.accommodation.id,
        roomContractSetId: contract.id,
        nationality: search.nationality,
        paymentMethod: $payment.paymentMethod,
        residency: search.residency,
        mainPassengerName: roomDetails[0].passengers[0].firstName + " " + roomDetails[0].passengers[0].lastName,
        agentReference: values.agentReference,
        roomDetails: roomDetails,
        features: [],
        itineraryNumber: values.itineraryNumber,
        supplier: $accommodation.selected.accommodation.source
    };
    $accommodation.setBookingRequest(request);

    var error = err => {
        $notifications.addNotification(err?.title || err?.detail || err?.message);
        setSubmitting(false);
    };

    if ($payment.paymentMethod == PAYMENT_METHODS.ACCOUNT)
        API.post({
            url: API.BOOK_BY_ACCOUNT,
            body: request,
            success: result => {
                if (!result?.bookingDetails?.referenceCode) {
                    $notifications.addNotification("Error occurred during account payment");
                    return;
                }
                $payment.setPaymentResult(null);
                $payment.setSubject(result.bookingDetails.referenceCode);
                redirect("/accommodation/confirmation");
            },
            error
        });

    if ($payment.paymentMethod == PAYMENT_METHODS.CARD)
        API.post({
            url: API.ACCOMMODATION_BOOKING,
            body: request,
            success: result => {
                $payment.setSubject(result, $accommodation.selected.roomContractSet.rate.finalPrice);
                redirect("/payment/form");
            },
            error
        });
};

export default taskSubmitBookingForm;
