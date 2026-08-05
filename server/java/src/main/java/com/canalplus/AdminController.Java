@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*") // Pour Vercel
public class AdminController {

    @Autowired
    private OperationRepository repo;

    // Route pour lister les opérations à valider
    @GetMapping("/operations")
    public List<Operation> getPendingOps() {
        return repo.findByStatut("en_attente");
    }

    // Route pour valider
    @PostMapping("/operations/{id}/valider")
    public Operation valider(@PathVariable Long id) {
        Operation op = repo.findById(id).get();
        op.setStatut("validee");
        return repo.save(op); // Rust sera notifié via WebSocket
    }
}
