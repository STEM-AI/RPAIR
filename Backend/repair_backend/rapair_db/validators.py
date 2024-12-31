import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class StrongPasswordValidator:
    """
    Validates that the password contains:
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    - A minimum length (optional)
    """

    def __init__(self, min_length=8):
        self.min_length = min_length

    def validate(self, password, user=None):
        # Check for minimum length
        if len(password) < self.min_length:
            raise ValidationError(
                _("Password must be at least %(min_length)d characters long.") % {'min_length': self.min_length}
            )

        # Check for digits, letters, and special characters using regex
        if not re.search(r'[0-9]', password):
            raise ValidationError(
                _("Password must contain at least one digit."),
                code='password_no_digit',
            )
        if not re.search(r'[A-Za-z]', password):
            raise ValidationError(
                _("Password must contain at least one letter."),
                code='password_no_letter',
            )
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _("Password must contain at least one uppercase letter."),
                code='password_no_upper',
            )
        if not re.search(r'[~\!@#\$%\^&\*\(\)_\+{}":;\'\[\]]', password):
            raise ValidationError(
                _("Password must contain at least one special character."),
                code='password_no_special',
            )

    def get_help_text(self):
        return _(
            "Your password must contain at least one uppercase letter, "
            "one lowercase letter, one digit, one special character, "
            "and be at least %(min_length)d characters long."
        ) % {'min_length': self.min_length}
