package ccu.four.backend.models.note;

import ccu.four.backend.models.User;

import javax.persistence.*;
import java.util.Date;

@MappedSuperclass
public abstract class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(nullable = false)
    private String header;

    @Column(nullable = false)
    private String content;

    @OneToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private Date date;

    public Note() {
        this("", "");
    }

    public Note(String header, String content) {
        this(header, content, new Date());
    }

    public Note(String header, String content, Date date) {
        this.header = "";
        this.content = "";
        this.date = date;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public String getHeader() {
        return header;
    }

    public String getContent() {
        return content;
    }

    public Date getDate() {
        return date;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setHeader(String header) {
        this.header = header;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    @Override
    public String toString() {
        return "Note{" +
                "id=" + id +
                ", header='" + header + '\'' +
                ", content='" + content + '\'' +
                ", user=" + user +
                ", date=" + date +
                '}';
    }
//    public User getUser() {
//        return user;
//    }
//
//    public void setUser(User user) {
//        this.user = user;
//    }

}
