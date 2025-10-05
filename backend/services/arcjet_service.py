from arcjet import Shield, RateLimit, EmailRule

# Create Arcjet shield instance with rate limiting and email validation
arcjet_shield = Shield(
    rules=[
        RateLimit(
            max_requests=100,
            window_seconds=60,
            error_message="Too many requests. Please try again later."
        ),
        EmailRule(
            block_temporary=True,
            block_free=False,
            error_message="Invalid email address provided."
        )
    ]
)

def validate_request(request):
    """
    Validate individual requests using Arcjet shield
    """
    return arcjet_shield.validate(request)