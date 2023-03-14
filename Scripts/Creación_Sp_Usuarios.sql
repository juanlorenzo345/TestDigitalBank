ALTER PROCEDURE [dbo].[SP_USUARIOS]
(
	@idConsulta			INT, 
	@id					INT = NULL,
	@nombre				VARCHAR(100) = NULL,
	@fechaNacimiento	DATETIME = NULL,
	@sexo				CHAR(1) = NULL,

	@resultado INT = 0 OUT 
)

AS
	BEGIN
-- @idConsulta = 1 Consulta los usuarios por Id
		IF @idConsulta = 1
			BEGIN
				SELECT * 
				FROM Usuarios
				WHERE ((id = @id) OR (@id IS NULL))
			END

-- @idConsulta = 2 Inserta el usuario seleccionado.
		IF @idConsulta = 2
		BEGIN
			INSERT INTO Usuarios 
			VALUES (@nombre,
					@fechaNacimiento,
					@sexo)
		SET @resultado = SCOPE_IDENTITY();
		END

-- @idConsulta = 3 Actualiza el usuario seleccionado.
		IF @idConsulta = 3
		BEGIN
			UPDATE Usuarios SET
					nombre = @nombre ,
					fechaNacimiento = @fechaNacimiento,
					sexo = @sexo
			WHERE id =  @id
		SET @resultado = @id
		END

-- @idConsulta = 4 Elimina el usuario seleccionado.
		IF @idConsulta = 4
		BEGIN
			DELETE Usuarios
			WHERE id = @id
		SET @resultado = @id
		END

	END

