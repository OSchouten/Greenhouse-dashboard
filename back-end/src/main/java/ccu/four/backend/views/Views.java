package ccu.four.backend.views;

public interface Views extends EntityViews {
    public static interface Minimal {
    }

    public static interface Public extends Minimal {
    }

    public static interface Internal extends Public {
    }
}
