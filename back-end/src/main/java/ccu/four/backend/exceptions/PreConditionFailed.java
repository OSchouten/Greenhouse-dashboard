package ccu.four.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.PRECONDITION_FAILED)
public class PreConditionFailed extends RuntimeException {
    public PreConditionFailed(String message) {
        super(message);
    }
}

