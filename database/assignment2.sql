
-- 1) Change account
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2) edit account
UPDATE account 
SET account_type='Admin' 
WHERE account_firstname='Tony' AND account_lastname='Stark';

-- 3) delete "Tony Starks" account
DELETE FROM account WHERE account_firstname='Tony' AND account_lastname='Stark';
 
-- 4) Modify the "GM Hummer" record to read "a huge interior" rather than "small interiors"
UPDATE inventory
SET inv_description = REPLACE(
    inv_description,
    'the small interiors',
    'a huge interior'
)WHERE inv_make='GM' AND inv_model='Hummer';

-- 5) select the make and model fields from the inventory table and the classification name 
--    field from the classification table for inventory items that belong to the "Sport" category. 
SELECT inv_make, inv_model, classification_name
FROM inventory 
  INNER JOIN classification on classification.classification_id = inventory.classification_id
WHERE inventory.classification_id = 2;

-- 6) add "/vehicles" to the middle of the file path in the 
--    inv_image and inv_thumbnail columns using a single query.
UPDATE inventory
SET 
  inv_thumbnail = REPLACE (REPLACE (inv_thumbnail, '/images', '/images/vehicles'),
						'/vehicles/vehicles', '/vehicles'),   
  inv_image = REPLACE (REPLACE(inv_image, '/images', '/images/vehicles'), 
					   '/vehicles/vehicles', '/vehicles');
  
  -- Thoughts, only submit the 1 line, remove the unecessary extra REPLACE removing extra vehicles
  -- inv_image = REPLACE(inv_image, '/images', '/images/vehicles')
-- 7)