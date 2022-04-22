package ccu.four.backend.views;

public interface EntityViews {
    public static interface Users extends Views.Minimal {
    }

    public static interface Sensors extends Views.Minimal {
    }

    public static interface Teams extends Views.Minimal {
    }

    public static interface Notes extends Sensors {
    }
}
