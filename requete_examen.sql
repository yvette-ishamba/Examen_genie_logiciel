/*Creation de la base des donnees*/

CREATE DATABASE taxe_app_db

/*Creation de la vue pour afficher les taxes*/
CREATE VIEW vue_taxes AS
SELECT 
    id,
    nom,
    montant_base,
    frequence,
    description
FROM taxe_app_db.taxes;

/*Creation d'une vue pour afficher les vendeurs*/
CREATE VIEW list_vendeurs AS
SELECT 
    id,
    CONCAT(nom, ' ', prenom) AS noms,
    telephone,
    identifiant_national AS id_nat,
    emplacement AS marche
FROM taxe_app_db.vendeurs;

/*Creation de la vue pour afficher les collectes des taxes*/
CREATE VIEW vw_agent_collecte_stats AS
SELECT
    u.id AS agent_id,
    u.full_name AS agent_name,
    COALESCE(SUM(p.montant), 0) AS total_collected,
    COUNT(p.id) AS nb_collectes
FROM taxe_app_db.users u
LEFT JOIN taxe_app_db.paiements p 
    ON u.id = p.collection_user_id
WHERE u.role = 'Agent de Collecte'
GROUP BY u.id, u.full_name;

select * from vw_agent_collecte_stats

use taxe_app_db

/*Creation de la procedure pour modifier le users*/
DROP PROCEDURE IF EXISTS sp_UpdateUser;

DELIMITER //

CREATE PROCEDURE sp_UpdateUser(
    IN p_user_id INT,
    IN p_full_name VARCHAR(255),
    IN p_phone_number VARCHAR(50),
    IN p_role VARCHAR(50)
)
BEGIN
    UPDATE users 
    SET full_name = p_full_name,
        phone_number = p_phone_number,
        role = p_role
    WHERE id = p_user_id;
END //

DELIMITER ;