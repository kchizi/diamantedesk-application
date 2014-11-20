<?php
/*
 * Copyright (c) 2014 Eltrino LLC (http://eltrino.com)
 *
 * Licensed under the Open Software License (OSL 3.0).
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://opensource.org/licenses/osl-3.0.php
 *
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@eltrino.com so we can send you a copy immediately.
 */

namespace Diamante\DeskBundle\Infrastructure\Shared\Adapter;

use Diamante\ApiBundle\Infrastructure\Persistence\DoctrineApiUserRepository;
use Diamante\DeskBundle\Model\Shared\UserService;
use Oro\Bundle\UserBundle\Entity\UserManager;
use Oro\Bundle\UserBundle\Entity\User;
use Diamante\DeskBundle\Model\User\User as DiamanteUser;

class OroUserService implements UserService
{
    /**
     * @var UserManager
     */
    private $oroUserManager;
    private $diamanteApiUserRepository;

    function __construct(
        UserManager $userManager,
        DoctrineApiUserRepository $diamanteApiUserRepository
    )
    {
        $this->oroUserManager            = $userManager;
        $this->diamanteApiUserRepository = $diamanteApiUserRepository;
    }

    /**
     * Retrieve User entity
     * @param int $id
     * @return User
     */
    public function getUserById($id)
    {
        $user = $this->userManager->findUserBy(array('id' => $id));
        if (is_null($user)) {
            throw new \RuntimeException("User doesn't exist.");
        }
        return $user;
    }

    public function getByUser(DiamanteUser $user)
    {
        if ($user->getType() == 'oro') {
            $user = $this->oroUserManager->findUserBy(array('id' => $user->getId()));
        } else {
            $user = $this->diamanteApiUserRepository->get($user->getId());
        }

        return $user;
    }
}
