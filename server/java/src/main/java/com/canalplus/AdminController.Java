@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminController {

    private final OperationRepository opRepo;
    private final PdvRepository pdvRepo;
    private final CommissionRepository comRepo;

    @Transactional // TOUT OU RIEN
    @PostMapping("/operations/{id}/valider")
    public ResponseEntity<?> valider(@PathVariable Long id) {
        Operation op = opRepo.findById(id).orElseThrow();
        if(!op.getStatut().equals("en_attente")) return ResponseEntity.badRequest().body("Déjà traitée");

        Pdv pdv = pdvRepo.findById(op.getPdvId()).orElseThrow();
        
        // 1. Passer l'opération en validée
        op.setStatut("validee");
        opRepo.save(op);

        // 2. Passer la commission en validée
        Commission com = comRepo.findByOperationId(id);
        com.setStatut("validee");
        comRepo.save(com);

        // 3. RECREDITER LE PDV : on lui rend son argent car vente confirmée
        pdv.setCredit(pdv.getCredit() + op.getMontantPaye());
        pdv.setEncours(pdv.getEncours() - op.getMontantPaye());
        pdvRepo.save(pdv);

        return ResponseEntity.ok(op);
    }

    @PostMapping("/operations/{id}/rejeter")
    public ResponseEntity<?> rejeter(@PathVariable Long id, @RequestBody String motif) {
        Operation op = opRepo.findById(id).orElseThrow();
        op.setStatut("rejetee");
        op.setMotifRejet(motif);
        opRepo.save(op);
        // On recrédite aussi car vente annulée
        Pdv pdv = pdvRepo.findById(op.getPdvId()).orElseThrow();
        pdv.setCredit(pdv.getCredit() + op.getMontantPaye());
        pdv.setEncours(pdv.getEncours() - op.getMontantPaye());
        pdvRepo.save(pdv);
        return ResponseEntity.ok(op);
    }
}
