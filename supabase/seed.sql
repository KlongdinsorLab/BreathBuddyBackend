INSERT INTO difficulties_table (id, name, inhale_second)
VALUES
    ('1', 'ง่าย', 0.5),
    ('2', 'ปานกลาง', 1),
    ('3', 'ยาก', 2);

INSERT INTO characters_table (id, name, achievement_number_required, detail)
VALUES
    ('1', 'นักผจญภัย', 0, 'ลุยแบบสุดขีด เต็มพลัง'),
    ('2', 'นักเวทย์', 4, 'เวทย์มนต์ไม่ใช่ของตั้งโชว์นะ'),
    ('3', 'จอมโจร', 8, 'สมบัติของเธอ ขอรับไปละนะ');

INSERT INTO boosters_table (id, name, type)
VALUES
    ('1', 'booster1', 'NORMAL'),
    ('2', 'booster2', 'NORMAL'),
    ('3', 'booster3', 'NORMAL'),
    ('4', 'booster4', 'NORMAL'),
    ('5', 'booster5', 'NORMAL'),
    ('6', 'booster_rare1', 'RARE'),
    ('7', 'booster_rare2', 'RARE');

INSERT INTO bosses_table (id, name)
VALUES
    ('1', 'เอเลี่ยนซ่า'),
    ('2', 'สไลม์คิง'),
    ('3', 'ก็อตซ่า'),
    ('4', 'ไอซ์โกเลม'),
    ('5', 'ไก่ทอด');

INSERT INTO levels_table (id, level, score_required, boss_id, booster_id_1, booster_id_2, booster_id_3, booster_amount_1, booster_amount_2, booster_amount_3)
VALUES
    ('1', 1, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('2', 2, 85000, 2, NULL, NULL, NULL, NULL, NULL, NULL),
    ('3', 3, 850000, NULL, 4, 5, 6, 5, 5, 5),
    ('4', 4, 2125000, 3, NULL, NULL, NULL, NULL, NULL, NULL),
    ('5', 5, 3825000, NULL, 4, 5, 7, 5, 5, 5),
    ('6', 6, 5190000, 4, NULL, NULL, NULL, NULL, NULL ,NULL),
    ('7', 7, 10200000, NULL, 4, 5, 6, 5, 5, 5),
    ('8', 8, 15300000, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('9', 9, 21250000, NULL, 4, 5, 7, 5, 5, 5),
    ('10', 10, 28050000, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

INSERT INTO achievements_table (id, name, games_played_in_a_day, games_played_consecutive_days, accumulative_score, games_played, boosters_number, booster_type, booster_action, booster_unique, boss_id, boss_encounter, characters_unlocked)
VALUES
    ('1', '3hearts', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('2', '3days', NULL, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('3', '5days', NULL, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('4', '7days', NULL, 7, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('5', '500k', NULL, NULL, 5e5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('6', '3M', NULL, NULL, 3e6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('7', '8M', NULL, NULL, 8e6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('8', '20M', NULL, NULL, 20e6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('9', '10 games', NULL, NULL, NULL, 10, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('10', '100 games', NULL, NULL, NULL, 100, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('11', '200 games', NULL, NULL, NULL, 200, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
    ('12', '10 boosters', NULL, NULL, NULL, NULL, 10, 'NORMAL', 'USE', 'NONUNIQUE', NULL, NULL, NULL),
    ('13', '5boosterrares', NULL, NULL, NULL, NULL, 5, 'RARE', 'USE', 'NONUNIQUE', NULL, NULL, NULL),
    ('14', '7boosters', NULL, NULL, NULL, NULL, 7, NULL, 'GAIN', 'UNIQUE', NULL, NULL, NULL),
    ('15', '20gamesb4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, 20, NULL),
    ('16', '30gamesb5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, 30, NULL),
    ('17', '4mc', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4);