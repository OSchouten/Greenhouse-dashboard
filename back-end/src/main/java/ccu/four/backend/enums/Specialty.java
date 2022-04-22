package ccu.four.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.Optional;

public enum Specialty {
    Agronomy {
        public String toString() {
            return "Agronomy";
        }
    },
    Botany {
        public String toString() {
            return "Botany";
        }
    },
    Geology {
        public String toString() {
            return "Geology";
        }
    },
    Hydrology {
        public String toString() {
            return "Hydrology";
        }
    },
    ClimateScience {
        public String toString() {
            return "Climate Science";
        }
    },
    Admin {
        public String toString() {
            return "Admin";
        }
    };

    @JsonCreator
    public static Specialty setValue(String key){
        Optional<Specialty> specialty = Arrays.stream(Specialty.values())
                .parallel()
                .filter(sp -> sp.toString().equals(key) || sp.toString().replaceAll("\\s+","").equals(key))
                .findAny();
        return specialty.orElse(null);
    }
}
