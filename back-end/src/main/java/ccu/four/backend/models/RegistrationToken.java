package ccu.four.backend.models;

import javax.persistence.*;
import java.util.UUID;

@Entity
@NamedQuery(name = "find_latest_entry", query = "SELECT r FROM RegistrationToken r ORDER BY r.id DESC")
@Table(name = "registration_token")
public class RegistrationToken {


    @Column(unique = true, name = "token")
//    @Generated(GenerationTime.INSERT)
//    @Column(name = "token", insertable = false)
//    @GeneratedValue(generator = "uuid")
//    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String tokenString = String.valueOf(UUID.randomUUID());

    @Id
    @GeneratedValue
    private Long id;

//    @OneToOne
//    @JoinColumn(name=("user_id"), referencedColumnName = "id")
//    private User user;

    public RegistrationToken() {
    }

    public String getTokenString() {
        return tokenString;
    }

    public void setTokenString(String tokenString) {
        this.tokenString = tokenString;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
